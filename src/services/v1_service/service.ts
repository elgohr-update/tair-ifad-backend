import {Errors, GET, Path, QueryParam} from "typescript-rest";
import {AnnotationStatus, Aspect, makeGroupedAnnotations, readData,} from "../../utils/ingest";
import {queryAnnotated, QueryOption, Strategy} from "../../queries/queries";

const { geneMap, annotations, groupedAnnotations } = readData();

@Path("/api/v1")
export class V1Service {

    @Path("/genes")
    @GET
    genes(
        /**
         * ?filter[]
         * This query is used to generate a selection of genes and annotations
         * according to which Aspect and Annotation Status they belong to.
         */
        @QueryParam("filter") maybeFilters: string[],
        /**
         * ?strategy
         * This query parameter is used to choose whether genes and annotations
         * are selected using a "union" strategy (where at least one filter must
         * match) or using an "intersection" strategy (where all filters must
         * match). The default value is "union".
         */
        @QueryParam("strategy") maybeStrategy: string = "union",
    ) {
        // Validate all of the filter query params. This throws a 400 if any are formatted incorrectly.
        const filters: IFilterParam[] = (maybeFilters || []).map(validateFilter);

        let query: QueryOption;

        if (filters.length === 0) {
            query = { tag: "QueryGetAll" };
        } else {

            // Validates the strategy query param string, which must be exactly "union" or "intersection".
            const strategy: Strategy = validateStrategy(maybeStrategy);
            query = { tag: "QueryWith", strategy, filters };
        }

        // TODO include unannotated genes
        const [queriedGenes, queriedAnnotations] = queryAnnotated(annotations, geneMap, query);

        return {annotatedGenes: queriedGenes, annotations: queriedAnnotations, unannotatedGenes: []};
    }

    @Path("/wgs_segments")
    @GET
    get_wgs() {
        const totalGeneCount = Object.keys(geneMap).length;

        const result = Object.entries(groupedAnnotations).reduce((acc, [aspect, {all, known: {all: known_all, exp, other }, unknown}]) => {
            acc[aspect].all = all.size;
            acc[aspect].known.all = known_all.size;
            acc[aspect].known.exp = exp.size;
            acc[aspect].known.other = other.size;
            acc[aspect].unknown = unknown.size;
            acc[aspect].unannotated = totalGeneCount - all.size;
            return acc;
        }, makeGroupedAnnotations(() => 0));

        result["totalGenes"] = totalGeneCount;
        return result;
    }
}

/**
 * A Filter is used to match genes and annotations based on which Aspect
 * and Annotation Status they have.
 */
export interface IFilterParam {
    aspect: Aspect;
    annotation_status: AnnotationStatus;
}

/**
 * Validates a query string as an Aspect, which may be exactly "F", "C", or "P",
 * @param maybeAspect The aspect query string being checked.
 */
function validateAspect(maybeAspect: string): maybeAspect is Aspect {
    return maybeAspect === "F" || maybeAspect === "C" || maybeAspect === "P";
}

/**
 * Validates a query string as an Annotation Status, which must be exactly
 * "EXP", "OTHER", "UNKNOWN", or "UNANNOTATED".
 *
 * @param maybeStatus
 */
function validateAnnotationStatus(maybeStatus: string): maybeStatus is AnnotationStatus {
    return maybeStatus === "EXP" ||
        maybeStatus === "OTHER" ||
        maybeStatus === "UNKNOWN" ||
        maybeStatus === "UNANNOTATED";
}

/**
 * Validates that a filter string is properly formatted.
 *
 * The proper format for a filter is ASPECT,ANNOTATION_STATUS
 * where ASPECT is exactly "P", "C", or "F", and
 * where ANNOTATION_STATUS is exactly "EXP", "OTHER", "UNKNOWN", or "UNANNOTATED".
 *
 * This function throws a 400 if the filter is ill-formatted, or an
 * IFilter object with the filter parts if the validation succeeded.
 *
 * @param maybeFilter The string which we are checking is a valid filter.
 */
function validateFilter(maybeFilter: string): IFilterParam {
    const parts = maybeFilter.split(",");
    if (parts.length !== 2) {
        throw new Errors.BadRequestError("each filter must have exactly two parts, an Aspect and an Annotation Status, separated by a comma");
    }

    const [aspect, annotation_status] = parts;
    if (!validateAspect(aspect)) {
        throw new Errors.BadRequestError("the Aspect given in a filter must be exactly 'P', 'C', or 'F'");
    }
    if (!validateAnnotationStatus(annotation_status)) {
        throw new Errors.BadRequestError("the Annotation Status given in a filter must be exactly 'EXP', 'OTHER', 'UNKNOWN', or 'UNANNOTATED'");
    }

    return {aspect, annotation_status};
}

/**
 * Validates that a query string is a proper strategy, either
 * "union" or "intersection".
 *
 * Throws a 400 if the query is ill-formatted.
 *
 * @param maybeStrategy "union" | "intersection"
 */
function validateStrategy(maybeStrategy: string): Strategy {
    if (maybeStrategy !== "union" && maybeStrategy !== "intersection") {
        throw new Errors.BadRequestError("strategy must be either 'union' or 'intersection'");
    }
    return maybeStrategy;
}
