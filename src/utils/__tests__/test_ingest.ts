import {parseAnnotations, parseGenes} from "../ingest";

const gene_data = `
AT1G01010	protein_coding
AT1G01020	protein_coding
AT1G01030	protein_coding
AT1G01040	protein_coding
AT1G01046	miRNA_primary_transcript
AT1G01050	protein_coding
AT1G01060	protein_coding
AT1G01070	protein_coding
AT1G01080	protein_coding
AT1G01090	protein_coding
`;

const annotation_data = `
TAIR	locus:2079747	ALY2		GO:0000003	TAIR:Communication:501741973	IBA	PANTHER:PTN000495591|WB:WBGene00002998	P	AT3G05380	AT3G05380|ALY2|ATALY2|ALWAYS EARLY 2|ARABIDOPSIS THALIANA ALWAYS EARLY 2|F22F7.18|F22F7_18	protein	taxon:3702	20180615	GOC		TAIR:locus:2079747
TAIR	locus:2089438	ALY3		GO:0000003	TAIR:Communication:501741973	IBA	PANTHER:PTN000495591|WB:WBGene00002998	P	AT3G21430	AT3G21430|ATALY3|ALY3|ARABIDOPSIS THALIANA ALWAYS EARLY 3|ALWAYS EARLY 3	protein	taxon:3702	20180615	GOC		TAIR:locus:2089438
TAIR	locus:2143666	ALY1		GO:0000003	TAIR:Communication:501741973	IBA	PANTHER:PTN000495591|WB:WBGene00002998	P	AT5G27610	AT5G27610|ATALY1|ALY1|ARABIDOPSIS THALIANA ALWAYS EARLY 1|ALWAYS EARLY 1|F15A18.70|F15A18_70	protein	taxon:3702	20180615	GOC		TAIR:locus:2143666
TAIR	locus:2179122	APTX		GO:0000012	TAIR:Communication:501741973	IBA	PANTHER:PTN000281062|MGI:MGI:1913658|UniProtKB:Q7Z2E3	P	AT5G01310	AT5G01310|APTX|APRATAXIN-like|T10O8.20|T10O8_20	protein	taxon:3702	20180803	GOC		TAIR:locus:2179122
TAIR	locus:2150931	TDP1		GO:0000012	TAIR:Communication:501741973	IBA	PANTHER:PTN000275870|MGI:MGI:1920036|UniProtKB:Q9NUW8	P	AT5G15170	AT5G15170|TDP1|tyrosyl-DNA phosphodiesterase 1|F8M21.60|F8M21_60	protein	taxon:3702	20180803	GOC		TAIR:locus:2150931
TAIR	locus:2202114	BFN1		GO:0000014	TAIR:Communication:501741973	IBA	PANTHER:PTN002107734|TAIR:locus:2202114	F	AT1G11190	AT1G11190|BFN1|ENDO1|bifunctional nuclease i|ENDONUCLEASE 1|T28P6.14|T28P6_14	protein	taxon:3702	20180615	GOC		TAIR:locus:2202114
TAIR	locus:2045437	RAD50		GO:0000014	TAIR:Communication:501741973	IBA	PANTHER:PTN000429848|UniProtKB:Q92878	F	AT2G31970	AT2G31970|RAD50|ATRAD50|F22D22.28|F22D22_28|dna repair-recombination protein	protein	taxon:3702	20180630	GOC		TAIR:locus:2045437
TAIR	locus:2096329	ERCC1		GO:0000014	TAIR:Communication:501741973	IBA	PANTHER:PTN000297520|UniProtKB:P07992|SGD:S000004560	F	AT3G05210	AT3G05210|ERCC1|UVR7|UV REPAIR DEFICIENT 7|T12H1.18|T12H1_18	protein	taxon:3702	20180803	GOC		TAIR:locus:2096329
TAIR	locus:1005716561	GR1		GO:0000014	TAIR:Communication:501741973	IBA	PANTHER:PTN000387514|UniProtKB:Q99708	F	AT3G52115	AT3G52115|ATGR1|ATCOM1|COM1|GR1|gamma response gene 1	protein	taxon:3702	20180615	GOC		TAIR:locus:1005716561
TAIR	locus:2163011	UVH1		GO:0000014	TAIR:Communication:501741973	IBA	PANTHER:PTN000015911|UniProtKB:Q9LKI5|SGD:S000005943	F	AT5G41150	AT5G41150|UVH1|ATRAD1|RAD1|ULTRAVIOLET HYPERSENSITIVE 1|MEE6.22|MEE6_22|repair endonuclease	protein	taxon:3702	20180615	GOC		TAIR:locus:2163011
`;

describe("Ingestion functions", () => {

    it("should parse a set of Annotations", () => {
        expect(parseAnnotations(annotation_data)).toMatchSnapshot();
    });

    it("should parse a set of Gene IDs and Gene Product Types", () => {
        expect(parseGenes(gene_data)).toMatchSnapshot();
    });

    it("should not fail if the input text is empty", () => {
        expect(() => parseGenes("")).not.toThrow();
    });
});
