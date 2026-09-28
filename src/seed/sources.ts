import type { Source } from '../model/types';

/**
 * Primary and scholarly references cited by specific seed edges.
 * Every seed concept additionally gets a `wp:<Article>` Wikipedia source, generated in ./index.ts.
 */
export const SEED_SOURCES: Source[] = [
  { id: 'salque2013', publisher: 'Nature 493, 522–525', url: 'https://doi.org/10.1038/nature11698',
    title: 'Salque et al. (2013), Earliest evidence for cheese making in the sixth millennium BC in northern Europe' },
  { id: 'evershed2022', publisher: 'Nature 608, 336–345', url: 'https://doi.org/10.1038/s41586-022-05010-7',
    title: 'Evershed et al. (2022), Dairying, diseases and the evolution of lactase persistence in Europe' },
  { id: 'fleming1929', publisher: 'British Journal of Experimental Pathology 10(3)',
    title: 'Fleming (1929), On the antibacterial action of cultures of a penicillium' },
  { id: 'fleming-nobel', publisher: 'NobelPrize.org', url: 'https://www.nobelprize.org/prizes/medicine/1945/fleming/lecture/',
    title: 'Alexander Fleming, Nobel Lecture: Penicillin (1945)' },
  { id: 'dcosta2011', publisher: 'Nature 477, 457–461', url: 'https://doi.org/10.1038/nature10388',
    title: 'D’Costa et al. (2011), Antibiotic resistance is ancient' },
  { id: 'denoeud2014', publisher: 'Science 345, 1181–1184', url: 'https://doi.org/10.1126/science.1255274',
    title: 'Denoeud et al. (2014), The coffee genome provides insight into the convergent evolution of caffeine biosynthesis' },
  { id: 'huxley1868', publisher: 'Macmillan’s Magazine',
    title: 'T. H. Huxley (1868), On a Piece of Chalk' },
  { id: 'keynes1946', publisher: 'Royal Society tercentenary (read 1946, publ. 1947)',
    title: 'J. M. Keynes, Newton, the Man' },
  { id: 'kamland2011', publisher: 'Nature Geoscience 4, 647–651', url: 'https://doi.org/10.1038/ngeo1205',
    title: 'KamLAND Collaboration (2011), Partial radiogenic heat model for Earth revealed by geoneutrino measurements' },
  { id: 'bell1964', publisher: 'Physics 1, 195–200', url: 'https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195',
    title: 'J. S. Bell (1964), On the Einstein Podolsky Rosen paradox' },
  { id: 'nobel2022', publisher: 'NobelPrize.org', url: 'https://www.nobelprize.org/prizes/physics/2022/press-release/',
    title: 'The Nobel Prize in Physics 2022 — press release' },
  { id: 'galison2003', publisher: 'W. W. Norton',
    title: 'Peter Galison (2003), Einstein’s Clocks, Poincaré’s Maps' },
  { id: 'ashby2003', publisher: 'Living Reviews in Relativity 6', url: 'https://doi.org/10.12942/lrr-2003-1',
    title: 'Neil Ashby (2003), Relativity in the Global Positioning System' },
  { id: 'chou2010', publisher: 'Science 329, 1630–1633', url: 'https://doi.org/10.1126/science.1192720',
    title: 'Chou et al. (2010), Optical Clocks and Relativity' },
  { id: 'noether1918', publisher: 'Nachrichten der Königlichen Gesellschaft der Wissenschaften zu Göttingen',
    title: 'Emmy Noether (1918), Invariante Variationsprobleme' },
  { id: 'patterson1956', publisher: 'Geochimica et Cosmochimica Acta 10', url: 'https://doi.org/10.1016/0016-7037(56)90036-9',
    title: 'Clair Patterson (1956), Age of meteorites and the earth' },
  { id: 'shannon1948', publisher: 'Bell System Technical Journal 27',
    title: 'Claude Shannon (1948), A Mathematical Theory of Communication' },
  { id: 'turing1936', publisher: 'Proceedings of the London Mathematical Society s2-42',
    title: 'Alan Turing (1936), On Computable Numbers, with an Application to the Entscheidungsproblem' },
  { id: 'wigner1960', publisher: 'Communications on Pure and Applied Mathematics 13',
    title: 'Eugene Wigner (1960), The Unreasonable Effectiveness of Mathematics in the Natural Sciences' },
  { id: 'anderson1983', publisher: 'Verso',
    title: 'Benedict Anderson (1983), Imagined Communities' },
  { id: 'grafton1997', publisher: 'Harvard University Press',
    title: 'Anthony Grafton (1997), The Footnote: A Curious History' },
  { id: 'mumford1934', publisher: 'Harcourt, Brace',
    title: 'Lewis Mumford (1934), Technics and Civilization' },
  { id: 'alder2002', publisher: 'Free Press',
    title: 'Ken Alder (2002), The Measure of All Things' },
  { id: 'torpey2000', publisher: 'Cambridge University Press',
    title: 'John Torpey (2000), The Invention of the Passport' },
];

export function wikiSource(article: string): Source {
  return {
    id: `wp:${article}`,
    title: article.replace(/_/g, ' '),
    publisher: 'Wikipedia',
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article)}`,
  };
}
