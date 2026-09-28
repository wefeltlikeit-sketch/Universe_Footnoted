import { seedBundle } from './dsl';

/** Food, life, and the places food comes from. */
const { C, E, bundle } = seedBundle();

C('cheese', 'Cheese', 'food', 2, 'Milk, persuaded to last',
  `Cheese is milk made to last. Long before refrigeration, curdling [milk](milk) with rennet or acid and
  pressing out the whey turned a liquid that spoils in days into a food that could survive a winter.
  Its origins are tied to the [domestication](domestication) of sheep, goats and cattle: pottery sieves
  from what is now Poland, around 7,000 years old, carry milk-fat residues consistent with cheesemaking.
  Everything after that is the work of [microorganisms](microorganisms). Bacteria acidify the curd; molds
  such as [Penicillium](penicillium) ripen the rind and the blue veins. A soft [Camembert](camembert) and a
  pungent, washed-rind [Époisses](epoisses) are two answers to the same ancient problem, both shaped by a
  [fermentation](fermentation) that people relied on for millennia before anyone knew it was alive.`,
  { aliases: ['cheeses', 'fromage'] });
E('cheese', 'milk', 'production', 'direct', 'factual', 0.99,
  'Cheese is made by coagulating milk proteins (casein) and removing the whey.');
E('cheese', 'domestication', 'historical', 'strong', 'factual', 0.9,
  'Cheesemaking requires a steady milk supply, which only existed once sheep, goats and cattle were domesticated; the earliest chemical evidence of cheesemaking comes from Neolithic farming communities.',
  ['salque2013']);
E('cheese', 'microorganisms', 'biological', 'direct', 'factual', 0.97,
  'Lactic acid bacteria acidify the curd and, with yeasts and molds, drive ripening — a cheese is a managed microbial ecosystem.');
E('cheese', 'penicillium', 'biological', 'direct', 'factual', 0.97,
  'Penicillium species ripen many cheeses: P. camemberti forms white bloomy rinds, P. roqueforti the blue veins of Roquefort and other blue cheeses.');
E('cheese', 'camembert', 'production', 'direct', 'factual', 0.99,
  'Camembert is a soft, bloomy-rinded cow’s-milk cheese — one particular answer to the problem of preserving milk.');
E('cheese', 'epoisses', 'production', 'direct', 'factual', 0.99,
  'Époisses is a washed-rind cow’s-milk cheese from Burgundy, ripened by bacteria rather than surface molds.');
E('cheese', 'fermentation', 'biological', 'direct', 'factual', 0.95,
  'Bacteria ferment milk sugar (lactose) into lactic acid, which helps curdle, preserve and flavour the cheese.');

C('camembert', 'Camembert', 'food', 1, 'A soft, bloomy-rinded cheese from Normandy',
  `A soft cow’s-milk cheese from [Normandy](normandy), traditionally credited to Marie Harel, a farmer in
  the village of Camembert, around 1791 — a date tangled up with the [French Revolution](french-revolution),
  since legend says a priest fleeing persecution shared the recipe with her. Its white velvet rind is a
  living lawn of [Penicillium](penicillium) camemberti growing on curd made from [raw milk](milk). For
  most of the nineteenth century it was a regional cheese; faster [railways](railways) to Paris, and a
  round poplar-wood box introduced in 1890, let it travel. The French army then issued it to soldiers
  in [the First World War](world-war-i), turning a Normandy speciality into a national emblem.`);
E('camembert', 'normandy', 'geographical', 'direct', 'factual', 0.98,
  'Camembert is named after a village in the Pays d’Auge in Normandy, and “Camembert de Normandie” is a protected designation.');
E('camembert', 'french-revolution', 'historical', 'subtle', 'interpretive', 0.6,
  'The traditional origin story dates Camembert to 1791 and links it to a priest fleeing revolutionary persecution. The date is plausible; the story is legend rather than documented fact.');
E('camembert', 'penicillium', 'biological', 'direct', 'factual', 0.97,
  'Penicillium camemberti molds form Camembert’s white bloomy rind and break down the curd from the outside in, softening it as it ripens.');
E('camembert', 'milk', 'production', 'direct', 'factual', 0.98,
  'Traditional Camembert de Normandie must be made from raw cow’s milk.');
E('camembert', 'railways', 'historical', 'strong', 'interpretive', 0.75,
  'Rail links let fragile Norman soft cheeses reach Paris fast enough to sell; the wooden box of 1890 made longer journeys practical. Historians credit both with Camembert’s spread.');
E('camembert', 'world-war-i', 'historical', 'strong', 'factual', 0.8,
  'Camembert was issued to French troops during the First World War, which helped make it a fixture of French national food culture.');

C('epoisses', 'Époisses', 'food', 1, 'The notorious washed-rind cheese of Burgundy',
  `A washed-rind cheese from the village of Époisses in [Burgundy](burgundy), said to have been first made
  by Cistercian [monks](monasteries) in the early sixteenth century. While it ripens, its rind is washed
  again and again in brine and marc de Bourgogne, a spirit made by [distillation](distillation) of the
  grape skins and seeds left over from winemaking. The washing favours salt-tolerant bacteria over molds,
  chiefly Brevibacterium linens. These [microorganisms](microorganisms) are close relatives of the ones
  on human skin, and they give the rind its orange colour and its famous smell. Production nearly
  vanished after the Second World War. It was revived in 1956 and granted a protected designation in 1991.`,
  { wiki: 'Époisses_de_Bourgogne', aliases: ['epoisses', 'epoisses de bourgogne'] });
E('epoisses', 'burgundy', 'geographical', 'direct', 'factual', 0.98,
  'Époisses is named after its village in the Côte-d’Or department of Burgundy and is protected as “Époisses de Bourgogne”.');
E('epoisses', 'monasteries', 'historical', 'strong', 'interpretive', 0.7,
  'Tradition attributes the cheese to a community of Cistercian monks in the early 16th century. The attribution is widely repeated but thinly documented.');
E('epoisses', 'distillation', 'production', 'direct', 'factual', 0.95,
  'Époisses’ rind is washed with marc de Bourgogne, a pomace brandy — a product of distilling the fermented leftovers of winemaking.');
E('epoisses', 'microorganisms', 'biological', 'direct', 'factual', 0.95,
  'Rind washing selects for bacteria such as Brevibacterium linens (also found on human skin), which produce the orange colour and the pungent sulphur compounds.');

C('milk', 'Milk', 'food', 2, 'A food that evolved to be food',
  `Mammals make milk for their young, and for most of human history adults could not digest its sugar,
  lactose. That changed after the [domestication](domestication) of cattle, sheep and goats. In several
  herding populations a genetic variant spread that keeps the enzyme lactase working into adulthood.
  This is [lactase persistence](lactase-persistence), one of the clearest cases of recent human
  [evolution](evolution). People who could not drink milk could still eat it transformed: [cheese](cheese)
  and yoghurt contain much less lactose, because [fermentation](fermentation) consumes it. In the crowded
  [cities](cities) of the nineteenth century milk spread disease. It was made safe by heat treatment,
  named after [Louis Pasteur](pasteur), who first developed the method to stop wine spoiling.`);
E('milk', 'domestication', 'historical', 'direct', 'factual', 0.95,
  'Human milk use beyond infancy depends entirely on domesticated dairy animals; residues in Neolithic pottery show milk processing soon after cattle, sheep and goats were domesticated.');
E('milk', 'lactase-persistence', 'biological', 'direct', 'factual', 0.97,
  'Lactase persistence is the inherited ability to digest milk sugar in adulthood; it became common only in populations with a long history of dairying.');
E('milk', 'evolution', 'biological', 'strong', 'factual', 0.92,
  'The spread of lactase persistence is a textbook example of strong, recent natural selection in humans, driven by the use of milk.');
E('milk', 'fermentation', 'biological', 'direct', 'factual', 0.95,
  'Lactic acid bacteria ferment lactose, which is why yoghurt and aged cheese are tolerable to many lactose-intolerant people.');
E('milk', 'cities', 'historical', 'strong', 'factual', 0.8,
  'In 19th-century industrial cities, contaminated “swill milk” spread tuberculosis and other diseases, contributing to high infant mortality until pasteurization and inspection.');
E('milk', 'pasteur', 'biographical', 'strong', 'factual', 0.9,
  'Pasteurization is named after Louis Pasteur, who developed gentle heating in the 1860s to prevent wine and beer spoilage; it was later applied to milk.');

C('lactase-persistence', 'Lactase persistence', 'biology', 1, 'The gene that let adults drink milk',
  `Most mammals lose the ability to digest lactose after weaning. In some human populations, small changes
  in the [DNA](dna) that switches the lactase gene on and off keep it active for life. The trait arose
  independently in Europe, East Africa and the Middle East, with different mutations producing the same
  result. That is convergent [evolution](evolution) driven by dairying after the
  [domestication](domestication) of cattle. Ancient DNA holds a puzzle. The trait became common in Europe
  only within the last few thousand years, long after people began making [cheese](cheese). For thousands
  of years, fermentation may have done what genes had not yet done.`);
E('lactase-persistence', 'dna', 'biological', 'direct', 'factual', 0.95,
  'Lactase persistence is caused by variants in a regulatory region of DNA near the LCT gene (e.g. −13910*T in Europeans).');
E('lactase-persistence', 'evolution', 'biological', 'direct', 'factual', 0.95,
  'Different mutations producing lactase persistence arose and spread independently in Europe, Africa and the Middle East — convergent evolution under strong selection.');
E('lactase-persistence', 'domestication', 'causal', 'strong', 'factual', 0.88,
  'Selection for lactase persistence only makes sense where domestic animals supplied milk; the trait is concentrated in historically pastoralist populations.');
E('lactase-persistence', 'cheese', 'historical', 'subtle', 'interpretive', 0.75,
  'Ancient DNA shows European farmers processed milk for millennia before lactase persistence became common; fermented products like cheese are a likely reason they could.',
  ['evershed2022']);

C('penicillium', 'Penicillium', 'biology', 2, 'The paintbrush mold',
  `A genus of molds named for the brush-like shape of its spore-bearing structures. Penicillus is Latin
  for a small paintbrush, and the word “pencil” comes from the same root. Penicillium camemberti forms
  the white rind of [Camembert](camembert), and P. roqueforti the blue veins of Roquefort. Another species
  gave the twentieth century its first great drug. In 1928 [Alexander Fleming](fleming) noticed that a
  mold contaminating one of his bacterial cultures had killed the bacteria around it. The substance it
  secreted, penicillin, opened the age of [antibiotics](antibiotics). Molds are not bacteria but fungi,
  among the most varied [microorganisms](microorganisms). On the tree of [evolution](evolution), fungi sit
  closer to animals than to plants.`);
E('penicillium', 'fleming', 'biographical', 'direct', 'factual', 0.98,
  'In 1928 Fleming observed that a Penicillium mold contaminating a Staphylococcus culture inhibited the bacteria around it, and named the active substance penicillin.',
  ['fleming1929']);
E('penicillium', 'antibiotics', 'causal', 'direct', 'factual', 0.97,
  'Penicillin, produced by Penicillium molds, was the first widely used antibiotic and launched the antibiotic era.');
E('penicillium', 'microorganisms', 'biological', 'direct', 'factual', 0.9,
  'Penicillium molds are microscopic fungi; their spores and hyphae are only visible en masse.');
E('penicillium', 'evolution', 'biological', 'subtle', 'factual', 0.85,
  'Molecular phylogenetics places fungi and animals together in the Opisthokonta, sharing a more recent common ancestor than either does with plants.');

C('fermentation', 'Fermentation', 'biology', 3, 'Life without air',
  `Fermentation is how cells extract [energy](energy) from sugar without oxygen. Yeasts turn sugar into
  alcohol and carbon dioxide; bacteria turn lactose into lactic acid. People used it for bread, beer, wine
  and [cheese](cheese) for thousands of years without knowing that something alive was doing the work.
  In the 1850s and 1860s [Louis Pasteur](pasteur) showed that fermentation is the work of
  [microorganisms](microorganisms), and that different microbes make different fermentations. That
  discovery pointed him toward the [germ theory](germ-theory) of disease. Later, [distillation](distillation)
  concentrated fermentation’s alcohol into spirits.`);
E('fermentation', 'energy', 'biological', 'strong', 'factual', 0.9,
  'Fermentation is an anaerobic metabolic pathway that yields ATP — usable chemical energy — from sugars, far less efficiently than respiration.');
E('fermentation', 'pasteur', 'biographical', 'direct', 'factual', 0.97,
  'Pasteur’s studies (1857–1860s) established that fermentation is caused by living microorganisms, overturning purely chemical explanations.');
E('fermentation', 'microorganisms', 'biological', 'direct', 'factual', 0.98,
  'Yeasts and bacteria carry out the fermentations behind bread, beer, wine, yoghurt and cheese.');
E('fermentation', 'germ-theory', 'historical', 'strong', 'factual', 0.9,
  'Pasteur reasoned that if specific microbes cause specific fermentations and spoilage, specific microbes might cause specific diseases — a key step toward germ theory.');
E('fermentation', 'distillation', 'production', 'strong', 'factual', 0.9,
  'Fermentation alone cannot produce drinks much above ~15% alcohol; distilling fermented liquids concentrates the ethanol into spirits.');

C('coffee', 'A cup of coffee', 'food', 1, 'A seed that kept the world awake',
  `Coffee is the roasted seed of a shrub native to the highlands of Ethiopia. The earliest reliable
  evidence of coffee drinking comes from fifteenth-century Yemen, where Sufi mystics used it to stay
  awake through night-time devotions. Its active ingredient, [caffeine](caffeine), is a chemical the plant
  makes in part as a defence. Coffee spread through the Ottoman world into Europe, where
  [coffeehouses](coffeehouses) became places to read the news, argue and do business. One of them,
  Edward Lloyd’s in London, grew into the world’s great [insurance](insurance) market. Coffee also became
  a commodity of empire. It was grown on colonial plantations in the Caribbean, Java and Brazil, often by
  enslaved people, a history of economic and political [power](power).`,
  { wiki: 'Coffee', aliases: ['coffee', 'cup of coffee', 'espresso'] });
E('coffee', 'caffeine', 'chemical', 'direct', 'factual', 0.98,
  'Caffeine is the main psychoactive compound in coffee; it was first isolated from coffee beans in 1819.');
E('coffee', 'coffeehouses', 'cultural', 'direct', 'factual', 0.97,
  'Coffeehouses spread from the Ottoman Empire to Europe in the 16th–17th centuries as the social institution built around the drink.');
E('coffee', 'insurance', 'historical', 'strong', 'factual', 0.88,
  'Lloyd’s of London, the insurance market, began as Edward Lloyd’s coffeehouse, where shipping news and underwriting shared the tables with the coffee.');
E('coffee', 'power', 'economic', 'strong', 'factual', 0.82,
  'European colonial powers expanded coffee cultivation through plantations in the Caribbean, Java and Brazil, relying heavily on enslaved and coerced labour.');

C('caffeine', 'Caffeine', 'chemistry', 1, 'A plant’s insecticide, a person’s morning',
  `Caffeine is a bitter alkaloid. In plants it helps deter insects, and it suppresses competing seedlings
  when fallen leaves decay. In the brain it blocks receptors for adenosine, a molecule whose build-up
  signals fatigue. Adenosine is also a building block of ATP, the cell’s [energy](energy) currency. The
  chemist Friedlieb Ferdinand Runge first isolated caffeine from [coffee](coffee) in 1819, reportedly at
  the suggestion of Goethe. The same molecule evolved separately in coffee, tea and cacao. The plants
  reached it by different biochemical routes, a striking case of convergent [evolution](evolution) in
  [chemistry](chemistry).`);
E('caffeine', 'energy', 'biological', 'subtle', 'interpretive', 0.7,
  'Caffeine blocks adenosine receptors; adenosine is a component and breakdown product of ATP, and its build-up in the brain tracks accumulated activity. The link to “energy” is chemical, not caloric.');
E('caffeine', 'evolution', 'biological', 'strong', 'factual', 0.9,
  'Genome studies show coffee evolved its caffeine-making enzymes independently of tea and cacao — convergent evolution of the same molecule.',
  ['denoeud2014']);
E('caffeine', 'chemistry', 'chemical', 'strong', 'factual', 0.88,
  'Caffeine’s isolation (Runge, 1819) and later structural determination and synthesis (Emil Fischer, 1890s) are milestones of organic chemistry.');

C('coffeehouses', 'Coffeehouses', 'history', 1, 'The penny universities',
  `The first coffeehouses opened in the Ottoman Empire in the sixteenth century. England’s first appeared
  in Oxford around 1650, and by 1700 London had hundreds. For the price of a coffee anyone could join the
  conversation, which earned them the nickname “penny universities.” Natural philosophers met in them,
  and by tradition [Isaac Newton](newton) and Edmond Halley did too. The coffeehouse became a central
  image of the [Enlightenment](enlightenment)’s public sphere. Merchants gathered at particular houses
  for news of ships. Lloyd’s became the centre of marine [insurance](insurance), and dealers at Jonathan’s
  laid the groundwork for the London Stock Exchange and a new world of [money](money).`,
  { wiki: 'Coffeehouse' });
E('coffeehouses', 'newton', 'biographical', 'subtle', 'interpretive', 0.6,
  'Accounts place Royal Society figures, Newton and Halley among them, at London coffeehouses such as the Grecian; the details are anecdotal.');
E('coffeehouses', 'enlightenment', 'cultural', 'strong', 'interpretive', 0.8,
  'Historians (following Jürgen Habermas) treat coffeehouses as key sites of the Enlightenment “public sphere” where news and ideas were debated across ranks.');
E('coffeehouses', 'insurance', 'economic', 'direct', 'factual', 0.95,
  'Lloyd’s of London began in Edward Lloyd’s coffeehouse (c. 1688), where shipowners, merchants and underwriters met to insure voyages.');
E('coffeehouses', 'money', 'economic', 'strong', 'factual', 0.85,
  'Stockbrokers expelled from the Royal Exchange traded at Jonathan’s Coffee-House, the forerunner of the London Stock Exchange.');

C('insurance', 'Insurance', 'economics', 1, 'Turning catastrophe into arithmetic',
  `Insurance turns individual catastrophe into collective arithmetic. Marine insurance goes back to
  medieval Italian merchants. Its modern form grew from Edward Lloyd’s [coffeehouse](coffeehouses) in
  London, where shipowners and underwriters met. To price risk properly, insurers needed
  [probability](probability) and data. In 1693 Edmond Halley published one of the first life tables,
  built from records of births and deaths in the city of Breslau. Insurance is a technology of
  [money](money) and of trust. In the 1880s Bismarck’s Germany turned its logic into social insurance,
  and the modern [nation-state](nation-state) became an insurer too.`);
E('insurance', 'probability', 'mathematical', 'direct', 'factual', 0.92,
  'Pricing annuities and life insurance was among the first applications of probability; Halley’s 1693 Breslau life table put mortality on a quantitative footing.');
E('insurance', 'money', 'economic', 'direct', 'factual', 0.9,
  'Insurance pools money from many to pay the losses of a few; premiums and payouts are financial contracts over uncertain future events.');
E('insurance', 'nation-state', 'historical', 'strong', 'factual', 0.8,
  'Germany under Bismarck introduced compulsory health, accident and old-age insurance in the 1880s, the model for state social insurance systems.');

C('microorganisms', 'Microorganisms', 'biology', 3, 'Most of life, invisible',
  `Most life is too small to see. In the 1670s Antonie van Leeuwenhoek, a cloth merchant in Delft, looked
  through [microscopes](microscope) he made himself and saw “animalcules” in pond water and in the plaque
  on his teeth. Two centuries later Pasteur and Robert Koch showed that microbes cause
  [fermentation](fermentation) and disease, the [germ theory](germ-theory). Microorganisms built the
  planet. Cyanobacteria filled the atmosphere with oxygen, and the white cliffs of [chalk](chalk) are made
  of the skeletons of marine plankton. For most of Earth’s history all life was microbial:
  [evolution](evolution) spent some three billion years on single cells. Microbes also invented
  [antibiotics](antibiotics), as weapons in their own chemical wars.`,
  { wiki: 'Microorganism', aliases: ['microbes', 'bacteria', 'germs'] });
E('microorganisms', 'microscope', 'technological', 'direct', 'factual', 0.98,
  'Microorganisms were first seen by Antonie van Leeuwenhoek through his single-lens microscopes in the 1670s.');
E('microorganisms', 'germ-theory', 'biological', 'direct', 'factual', 0.97,
  'Germ theory holds that specific microorganisms cause specific infectious diseases.');
E('microorganisms', 'chalk', 'biological', 'direct', 'factual', 0.95,
  'Chalk is composed mostly of coccoliths — calcite plates made by single-celled marine algae (coccolithophores).');
E('microorganisms', 'evolution', 'biological', 'strong', 'factual', 0.9,
  'Life was exclusively microbial for most of its ~3.5-billion-year history; complex multicellular life appears only in the last ~600 million years.');
E('microorganisms', 'antibiotics', 'biological', 'strong', 'factual', 0.9,
  'Most antibiotics were discovered as natural products of soil bacteria (especially Streptomyces) and fungi, which use them against competitors.');

C('germ-theory', 'Germ theory', 'medicine', 3, 'Disease has an author',
  `Germ theory is the idea that specific [microorganisms](microorganisms) cause specific diseases. Between
  the 1860s and 1880s it replaced the older theory of miasma, which blamed disease on bad air. It came
  from [Pasteur](pasteur)’s experiments and from Robert Koch’s identification of the bacteria behind
  anthrax, tuberculosis and cholera. It rested on the [microscope](microscope) and on the discipline of
  [experimental science](experimental-science). Its consequences were enormous: antiseptic surgery,
  pasteurization, clean water in [cities](cities), and eventually [antibiotics](antibiotics).`,
  { wiki: 'Germ_theory_of_disease' });
E('germ-theory', 'pasteur', 'biographical', 'direct', 'factual', 0.97,
  'Pasteur’s work on fermentation, spontaneous generation and vaccines was central to establishing germ theory.');
E('germ-theory', 'microscope', 'technological', 'strong', 'factual', 0.9,
  'Identifying disease-causing bacteria, as Koch did for anthrax, tuberculosis and cholera, depended on improved microscopes and staining methods.');
E('germ-theory', 'experimental-science', 'conceptual', 'strong', 'factual', 0.85,
  'Koch’s postulates set explicit experimental criteria for proving that a microbe causes a disease — a model of controlled inference.');
E('germ-theory', 'cities', 'historical', 'strong', 'factual', 0.85,
  'Understanding waterborne disease drove urban sanitation — filtered water, sewers, chlorination — which dramatically cut city death rates.');
E('germ-theory', 'antibiotics', 'causal', 'strong', 'factual', 0.9,
  'The search for chemicals that kill specific pathogens — from Ehrlich’s “magic bullets” to penicillin — presupposes germ theory.');

C('pasteur', 'Louis Pasteur', 'person', 2, '1822–1895 · chemist of life',
  `Louis Pasteur began as a chemist studying crystals. In 1848 he found that tartaric acid comes in
  mirror-image forms, founding the study of molecular handedness, a question of [symmetry](symmetry).
  When winemakers and brewers asked why their products spoiled, he showed that
  [fermentation](fermentation) is the work of living [microorganisms](microorganisms) and devised gentle
  heating to kill them. His swan-necked flasks, which let in air but not dust, refuted spontaneous
  generation and remain a classic of [experimental science](experimental-science). He went on to develop
  vaccines against anthrax and rabies and helped establish the [germ theory](germ-theory). Another line
  of his is often quoted: “chance favours only the prepared mind.”`,
  { wiki: 'Louis_Pasteur', aliases: ['pasteur'] });
E('pasteur', 'symmetry', 'chemical', 'strong', 'factual', 0.9,
  'Pasteur separated left- and right-handed tartrate crystals by hand in 1848, showing that molecules can differ only in their mirror symmetry (chirality).');
E('pasteur', 'microorganisms', 'biographical', 'direct', 'factual', 0.95,
  'Pasteur demonstrated that specific microorganisms cause fermentation and spoilage, and that sterile broth stays sterile.');
E('pasteur', 'experimental-science', 'conceptual', 'strong', 'factual', 0.85,
  'Pasteur’s swan-neck flask experiment (1859–62) is a textbook controlled experiment that settled the spontaneous-generation debate.');

C('antibiotics', 'Antibiotics', 'medicine', 2, 'Borrowed weapons',
  `Antibiotics are chemicals that kill or stop bacteria while sparing the patient. Most were first found
  in [microorganisms](microorganisms), molds and soil bacteria that make them to fight competitors.
  [Fleming](fleming) noticed penicillin’s effect in 1928. It became a drug only when Howard Florey, Ernst
  Chain and colleagues at Oxford purified and tested it in 1939–41, and wartime industry learned to make
  it by the ton. Antibiotics transformed surgery, childbirth and the treatment of wounds. Every use,
  though, applies selection pressure. [Antibiotic resistance](antibiotic-resistance) is
  [evolution](evolution) happening fast enough to watch.`,
  { wiki: 'Antibiotic', aliases: ['antibiotic', 'penicillin'] });
E('antibiotics', 'fleming', 'biographical', 'direct', 'factual', 0.97,
  'Fleming discovered penicillin in 1928; Florey and Chain developed it into a drug, and the three shared the 1945 Nobel Prize.');
E('antibiotics', 'antibiotic-resistance', 'causal', 'direct', 'factual', 0.98,
  'Using antibiotics selects for bacteria that survive them; resistance rises with antibiotic use.');
E('antibiotics', 'evolution', 'biological', 'strong', 'factual', 0.9,
  'Antibiotic treatment is a strong selective pressure; resistant strains evolve within years of a new drug’s introduction.');

C('fleming', 'Alexander Fleming', 'person', 1, '1881–1955 · the untidy bench',
  `Alexander Fleming was a Scottish bacteriologist at St Mary’s Hospital in London. During the
  [First World War](world-war-i) he studied infected wounds in military hospitals in France, and saw
  antiseptics fail. In 1922 he discovered lysozyme, an antibacterial enzyme in tears. Back from holiday in
  September 1928, he found that a [Penicillium](penicillium) mold had contaminated a culture of
  staphylococci and killed the bacteria around it. He published in 1929 but could not purify the
  substance. [Antibiotics](antibiotics) became real medicine only a decade later. In his 1945 Nobel
  lecture he warned that underdosing could breed resistant microbes, an early warning about
  [antibiotic resistance](antibiotic-resistance). The story is often told as proof of
  [Pasteur](pasteur)’s maxim about chance and the prepared mind.`,
  { wiki: 'Alexander_Fleming', aliases: ['fleming'] });
E('fleming', 'world-war-i', 'biographical', 'strong', 'factual', 0.9,
  'Fleming served in the Royal Army Medical Corps in WWI, studying wound infections and showing that antiseptics could do more harm than good in deep wounds.');
E('fleming', 'antibiotic-resistance', 'historical', 'strong', 'factual', 0.9,
  'In his 1945 Nobel lecture Fleming warned that underdosed penicillin could educate microbes to resist it.',
  ['fleming-nobel']);
E('fleming', 'pasteur', 'biographical', 'subtle', 'interpretive', 0.65,
  'Fleming’s accidental discovery is routinely cited as an illustration of Pasteur’s dictum that “chance favours only the prepared mind.” The link is rhetorical, not historical.');

C('antibiotic-resistance', 'Antibiotic resistance', 'medicine', 1, 'Evolution you can watch',
  `Bacteria reproduce in minutes and trade genes freely. When an antibiotic kills most of a population,
  the few survivors carrying resistance genes inherit the field. This is natural selection in
  fast-forward, [evolution](evolution) you can measure in a hospital ward. Resistance genes are older than
  medicine. They have been found in bacterial [DNA](dna) from 30,000-year-old permafrost, because
  [microorganisms](microorganisms) have fought chemical wars for eons. Heavy use in medicine and on farm
  animals, the industrial end of [domestication](domestication), speeds it up. [Darwin](darwin) never saw
  a bacterium evolve. We watch it happen every year.`,
  { wiki: 'Antimicrobial_resistance' });
E('antibiotic-resistance', 'evolution', 'biological', 'direct', 'factual', 0.98,
  'Resistance spreads by natural selection: antibiotic exposure removes susceptible bacteria, leaving resistant variants to multiply.');
E('antibiotic-resistance', 'dna', 'biological', 'strong', 'factual', 0.9,
  'Resistance genes identical in function to modern ones were recovered from 30,000-year-old permafrost DNA, showing resistance is ancient.',
  ['dcosta2011']);
E('antibiotic-resistance', 'microorganisms', 'biological', 'direct', 'factual', 0.95,
  'Soil microbes that produce antibiotics also carry resistance genes to protect themselves — the natural reservoir of resistance.');
E('antibiotic-resistance', 'domestication', 'economic', 'strong', 'factual', 0.82,
  'A large share of antibiotics worldwide is used in livestock, which accelerates the emergence and spread of resistance.');
E('antibiotic-resistance', 'darwin', 'conceptual', 'strong', 'factual', 0.85,
  'Resistance is natural selection exactly as Darwin described it — variation, inheritance, differential survival — observable in real time.');

C('evolution', 'Evolution', 'biology', 5, 'Change with memory',
  `Evolution is change in inherited traits across generations. [Charles Darwin](darwin) and Alfred Russel
  Wallace proposed natural selection as its main mechanism in 1858. Mendel’s heredity, and later
  [DNA](dna), explained how traits pass on. Darwin opened On the Origin of Species not with finches but
  with [domestication](domestication), because breeders had already shown what selection can do. The idea
  needs enormous stretches of time, [deep time](deep-time). And it has escaped biology: languages
  [descend and diverge](language) like species, as Darwin himself noted, and ideas and technologies are
  said to evolve. Sometimes that is close analogy, sometimes loose metaphor.`,
  { aliases: ['natural selection', 'darwinism'] });
E('evolution', 'darwin', 'biographical', 'direct', 'factual', 0.99,
  'Darwin’s On the Origin of Species (1859) established evolution by natural selection as a scientific theory.');
E('evolution', 'dna', 'biological', 'direct', 'factual', 0.95,
  'DNA carries hereditary variation; mutations in DNA are the raw material natural selection acts on.');
E('evolution', 'domestication', 'biological', 'direct', 'factual', 0.95,
  'Chapter 1 of the Origin, “Variation under Domestication”, used artificial selection by breeders as the model for natural selection.');
E('evolution', 'deep-time', 'causal', 'strong', 'factual', 0.9,
  'Gradual evolution by natural selection requires a very old Earth; Darwin relied on geology’s new timescales.');
E('evolution', 'language', 'analogical', 'strong', 'analogical', 0.78,
  'Languages descend with modification and branch into families; Darwin himself compared language genealogies to species. The processes differ, but the tree-building methods now overlap.');

C('darwin', 'Charles Darwin', 'person', 2, '1809–1882 · a very patient man',
  `Charles Darwin spent five years on HMS Beagle (1831–36), collecting fossils, rocks and island species.
  On board he read Charles Lyell’s Principles of [Geology](geology), which taught him that slow processes
  over [immense time](deep-time) could reshape a world. Back home he bred pigeons and corresponded with
  farmers to understand [domestication](domestication). He sat on his theory for twenty years, until a
  letter from Wallace forced him to publish. On the Origin of Species (1859) made [evolution](evolution)
  by natural selection a scientific theory. He spent his last years on earthworms and orchids, and was
  buried in Westminster Abbey, a few feet from [Isaac Newton](newton).`,
  { wiki: 'Charles_Darwin', aliases: ['darwin'] });
E('darwin', 'geology', 'biographical', 'direct', 'factual', 0.95,
  'Darwin read Lyell’s Principles of Geology on the Beagle and worked as a geologist early on; uniformitarian geology shaped his gradualism.');
E('darwin', 'deep-time', 'conceptual', 'strong', 'factual', 0.9,
  'Darwin’s theory required hundreds of millions of years; he even (over)estimated the erosion of the Weald at 300 million years.');
E('darwin', 'domestication', 'biographical', 'direct', 'factual', 0.92,
  'Darwin bred fancy pigeons and wrote The Variation of Animals and Plants under Domestication (1868).');
E('darwin', 'newton', 'biographical', 'subtle', 'factual', 0.9,
  'Darwin is buried in Westminster Abbey near Newton’s monument.');

C('dna', 'DNA', 'biology', 3, 'Heredity turned out to be text',
  `Deoxyribonucleic acid carries hereditary information as a sequence of four chemical letters. In 1953
  James Watson and Francis Crick proposed its double helix, drawing on X-ray diffraction images made by
  Rosalind Franklin and Raymond Gosling and on data from Maurice Wilkins’ group. The shape explained
  copying at a glance: each strand is a template for the other. Heredity turned out to be
  [information](information), a code that is copied, read and occasionally miscopied, which is the raw
  material of [evolution](evolution). Both Watson and Crick said they had been inspired by a 1944 book by
  a physicist. In What Is Life?, Erwin Schrödinger, a founder of [quantum mechanics](quantum-mechanics),
  guessed that genes store a “code-script” in an “aperiodic crystal.”`,
  { aliases: ['genes', 'genetics', 'double helix'] });
E('dna', 'information', 'conceptual', 'direct', 'factual', 0.92,
  'DNA stores hereditary information digitally, in sequences of four bases, and is transcribed and translated by cellular machinery.');
E('dna', 'quantum-mechanics', 'historical', 'subtle', 'factual', 0.8,
  'Schrödinger’s What Is Life? (1944), written by a founder of quantum mechanics, proposed a molecular “code-script” and influenced Watson, Crick and others.');

C('domestication', 'Domestication', 'history', 3, 'A partnership that remade both sides',
  `Domestication is a partnership, over many generations, in which people select plants and animals and
  those species reshape human life in return. Dogs came first, from wolves, before anyone farmed. Wheat,
  barley, sheep and goats were domesticated in the Fertile Crescent roughly 10,000 to 11,000 years ago,
  with cattle soon after, launching the [Neolithic Revolution](neolithic-revolution). Domestic animals
  gave [milk](milk), and milk in turn reshaped human genes. Living beside animals also carried
  [microorganisms](microorganisms) across the species line. Measles, for example, is thought to have
  evolved from a virus of cattle.`);
E('domestication', 'neolithic-revolution', 'historical', 'direct', 'factual', 0.97,
  'The domestication of crops and animals is what defines the Neolithic transition from foraging to farming.');
E('domestication', 'microorganisms', 'biological', 'strong', 'factual', 0.8,
  'Close contact with livestock allowed pathogens to jump to humans; molecular dating suggests measles diverged from the cattle virus rinderpest in antiquity.');

C('neolithic-revolution', 'Neolithic Revolution', 'history', 3, 'The switch to farming',
  `Between about 12,000 and 5,000 years ago, people in several regions switched from foraging to farming,
  independently: the Fertile Crescent, China, Mesoamerica, the Andes, New Guinea. It rested on
  [domestication](domestication). Farming fed more people per acre, so populations grew, even though early
  farmers were often shorter and less healthy than the foragers before them. Stored surplus made
  [cities](cities) possible, along with specialists, rulers and armies, a new scale of
  [power](power). Keeping track of that surplus helped drive the invention of [writing](writing). And
  farming meant reading the seasons, which is the origin of the [calendar](calendar).`,
  { aliases: ['agriculture', 'agricultural revolution', 'farming'] });
E('neolithic-revolution', 'cities', 'causal', 'direct', 'factual', 0.9,
  'Agricultural surpluses supported dense, permanent settlements; the first cities appear several thousand years after farming began.');
E('neolithic-revolution', 'power', 'historical', 'strong', 'interpretive', 0.8,
  'Most archaeologists link storable surpluses to the rise of social hierarchy, elites and states, though the pace and mechanisms are debated.');
E('neolithic-revolution', 'writing', 'causal', 'strong', 'interpretive', 0.78,
  'In Mesopotamia, the earliest writing records quantities of grain, livestock and labour — administration of agricultural surplus.');
E('neolithic-revolution', 'calendar', 'historical', 'strong', 'interpretive', 0.75,
  'Farming made the timing of planting and harvest vital; many early calendars and monuments track seasonal and solar cycles.');

C('cities', 'Cities', 'history', 3, 'Where strangers live together',
  `The first cities rose in Mesopotamia between about 3500 and 3000 BCE, and Uruk may have held tens of
  thousands of people. Cities needed farming surplus from the [Neolithic Revolution](neolithic-revolution)
  and they needed administration, and [writing](writing) appears in Uruk at about the same time. Crowding
  bred epidemics. Until the late nineteenth century many cities had more deaths than births and grew only
  through migration. Cities concentrate [power](power) and [money](money). They are where ideas collide,
  and where planning collides with disease. Baron Haussmann’s rebuilding of [Paris](paris), with sewers
  under its boulevards, became a model for the modern city.`,
  { wiki: 'City', aliases: ['city', 'urbanization'] });
E('cities', 'writing', 'historical', 'direct', 'factual', 0.9,
  'The earliest known writing (proto-cuneiform) comes from the city of Uruk around 3300–3200 BCE, used by urban temple administrators.');
E('cities', 'power', 'historical', 'strong', 'factual', 0.85,
  'Early cities were centres of kingship, temples and armies; urban states were the first large-scale political powers.');
E('cities', 'money', 'economic', 'strong', 'factual', 0.8,
  'Urban markets, specialised trades and long-distance commerce required units of account and, later, coinage and credit.');
E('cities', 'paris', 'cultural', 'strong', 'factual', 0.9,
  'Haussmann’s renovation of Paris (1853–70), with boulevards, parks and sewers, became a template for modern urban planning.');

C('monasteries', 'Monasteries', 'history', 2, 'Keepers of hours and manuscripts',
  `Medieval Christian monasteries were among Europe’s great institutions of continuity. Monks copied
  manuscripts and preserved classical texts, keeping [writing](writing) alive through centuries of
  disorder. Their rule divided the day into fixed hours of prayer, and some historians see in that
  discipline one root of Europe’s mechanical [clocks](clock), though others disagree. The Cistercian
  order, founded at Cîteaux in [Burgundy](burgundy) in 1098, was famous for farming, and monks were known
  for wine, beer and cheese, for [fermentation](fermentation) of every kind. Centuries later, Gregor
  Mendel worked out the laws of [heredity](evolution) in the garden of an abbey in Brno.`,
  { wiki: 'Monastery', aliases: ['monks', 'monastery', 'abbey'] });
E('monasteries', 'writing', 'historical', 'direct', 'factual', 0.9,
  'Monastic scriptoria copied and preserved a large share of the classical and patristic texts that survived the early Middle Ages.');
E('monasteries', 'clock', 'historical', 'subtle', 'interpretive', 0.62,
  'Lewis Mumford argued the monastery’s regimented hours fostered mechanical timekeeping; historians debate how much monasteries, versus towns and courts, drove early clocks.',
  ['mumford1934']);
E('monasteries', 'burgundy', 'geographical', 'direct', 'factual', 0.97,
  'Both the Benedictine abbey of Cluny (910) and the Cistercian mother house of Cîteaux (1098) are in Burgundy.');
E('monasteries', 'fermentation', 'cultural', 'strong', 'factual', 0.8,
  'Monasteries were major producers of wine, beer and cheese in medieval Europe; some monastic breweries still operate.');
E('monasteries', 'evolution', 'historical', 'subtle', 'factual', 0.8,
  'Gregor Mendel discovered the laws of inheritance, later central to evolutionary biology, through pea experiments at St Thomas’s Abbey in Brno.');

C('burgundy', 'Burgundy', 'geography', 1, 'Monks, dukes and limestone',
  `A region of east-central France named after the Burgundians, a Germanic people who settled there in the
  fifth century. In the fourteenth and fifteenth centuries its dukes ruled lands stretching to the Low
  Countries and rivalled the French crown. Burgundy was shaped by [monasteries](monasteries): Cluny and
  Cîteaux both stand here. Its winemakers, many of them monks, built the idea of terroir, the belief that
  a patch of ground can be tasted in the [fermented](fermentation) grape. The famous slopes follow a fault
  line in Jurassic limestone and marl, so the wine is partly a matter of [geology](geology). It also gave
  the world [Époisses](epoisses).`);
E('burgundy', 'fermentation', 'cultural', 'strong', 'factual', 0.85,
  'Burgundy is one of the world’s most celebrated wine regions; its classified vineyard plots (climats) are UNESCO World Heritage.');
E('burgundy', 'geology', 'geographical', 'strong', 'factual', 0.85,
  'The Côte d’Or escarpment is a fault scarp exposing Jurassic limestones and marls; soil variation along it underpins the idea of terroir.');

C('normandy', 'Normandy', 'geography', 1, 'Northmen, chalk and cream',
  `A region of northern France facing the English Channel, named for the Norsemen who settled there in the
  tenth century. In 1066 a Norman duke conquered England, and Norman French poured into English. Much of
  the vocabulary of law, government and cooked meat comes from it, “beef” from boeuf and “pork” from porc,
  which is a lesson in [language](language) and class. Its coast is lined with white [chalk](chalk) cliffs,
  like those at Étretat that Monet painted again and again during [Impressionism](impressionism). Caen
  stone from its quarries crossed the Channel to build [cathedrals](gothic-cathedral) such as Canterbury.
  Its pastures make [Camembert](camembert), and the rocks beneath them tell a [geological](geology) story
  hundreds of millions of years long.`);
E('normandy', 'language', 'linguistic', 'direct', 'factual', 0.9,
  'After the Norman Conquest of 1066, Anglo-Norman French became the language of England’s elite, contributing thousands of words to English.');
E('normandy', 'chalk', 'geographical', 'direct', 'factual', 0.95,
  'Upper Normandy’s Alabaster Coast (Côte d’Albâtre), including Étretat, is formed of Cretaceous chalk cliffs — the same formation as Dover’s.');
E('normandy', 'impressionism', 'cultural', 'direct', 'factual', 0.95,
  'Monet painted at Étretat, Le Havre, Rouen and Giverny; “Impression, Sunrise” (1872), which named the movement, depicts Le Havre harbour.');
E('normandy', 'gothic-cathedral', 'historical', 'strong', 'factual', 0.88,
  'Caen stone, a Jurassic limestone quarried in Normandy, was shipped to England for Canterbury Cathedral and other medieval buildings.');
E('normandy', 'geology', 'geographical', 'strong', 'factual', 0.85,
  'Normandy spans ancient Armorican Massif rocks in the west and younger Paris Basin sediments (including chalk) in the east.');

C('chalk', 'Chalk', 'earth', 1, 'A mountain of plankton',
  `Chalk is a soft white limestone made almost entirely of coccoliths, microscopic calcite plates shed by
  marine algae called coccolithophores, among the most abundant [microorganisms](microorganisms) in the
  sea. Most of Europe’s chalk formed in the Cretaceous period, roughly 100 to 66 million years ago, and the
  period is named after it, since creta is Latin for chalk. It is a record of [deep time](deep-time):
  hundreds of metres laid down a fraction of a millimetre a year. The cliffs of [Normandy](normandy) and
  Dover are one formation, cut apart by the English Channel. In 1868 Thomas Huxley gave a famous lecture
  to working men, “On a Piece of Chalk,” using it to teach [geology](geology) and
  [evolution](evolution).`);
E('chalk', 'deep-time', 'conceptual', 'direct', 'factual', 0.95,
  'Chalk accumulated slowly over tens of millions of years in the Cretaceous; its thickness is a physical measure of geological time.');
E('chalk', 'geology', 'geographical', 'direct', 'factual', 0.95,
  'Chalk is a sedimentary rock whose formation, fossils and stratigraphy are core objects of geological study.');
E('chalk', 'evolution', 'historical', 'strong', 'factual', 0.9,
  'Thomas Huxley’s 1868 lecture “On a Piece of Chalk” used its fossils to explain Earth’s history and evolution to a popular audience.',
  ['huxley1868']);

C('distillation', 'Distillation', 'chemistry', 2, 'Separating by boiling',
  `Distillation separates liquids by their boiling points. Heat a mixture, catch the vapour, and cool it
  back into liquid. Stills appear in the [alchemical](alchemy) writings of Hellenistic Alexandria. Scholars
  of the [medieval Islamic world](islamic-golden-age) improved the apparatus, and the words “alembic”
  (from al-anbīq) and “alcohol” (from al-kuḥl) both come from Arabic. Medieval European physicians and
  [monks](monasteries) distilled “aqua vitae,” the water of life. Distilling the products of
  [fermentation](fermentation) gives spirits, including the marc used to wash [Époisses](epoisses). As a
  laboratory method, distillation is one of the oldest tools of [chemistry](chemistry).`);
E('distillation', 'alchemy', 'technological', 'direct', 'factual', 0.92,
  'Distillation apparatus is described in the writings of Alexandrian alchemists (e.g. Zosimos, c. 300 CE) and remained a central alchemical operation.');
E('distillation', 'islamic-golden-age', 'historical', 'strong', 'interpretive', 0.78,
  'Chemists writing in Arabic refined distillation apparatus and techniques; Arabic loanwords such as alembic and alcohol record the transmission to Europe.');
E('distillation', 'monasteries', 'historical', 'subtle', 'interpretive', 0.65,
  'Medieval monastic and university physicians distilled “aqua vitae” as medicine; several liqueurs (e.g. Chartreuse) keep a monastic tradition.');
E('distillation', 'chemistry', 'technological', 'strong', 'factual', 0.9,
  'Distillation remains a fundamental laboratory and industrial method for separating and purifying substances.');

export default bundle();
