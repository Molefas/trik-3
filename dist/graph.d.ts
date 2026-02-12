/**
 * Article Search Skill - With Session Support
 *
 * Returns mock article data to demonstrate type-directed privilege separation.
 * Supports multi-turn conversations via session history for reference resolution.
 *
 * Actions:
 * - search: Find articles by topic
 * - details: Get article details by ID or natural language reference
 */
import type { SessionHistoryEntry } from '@trikhub/manifest';
interface TrikConfigContext {
    get(key: string): string | undefined;
    has(key: string): boolean;
    keys(): string[];
}
interface SkillInput {
    input: {
        topic?: string;
        articleId?: string;
        reference?: string;
        articleIds?: string[];
    };
    action: string;
    session?: {
        sessionId: string;
        history: SessionHistoryEntry[];
    };
    config?: TrikConfigContext;
}
interface SearchOutput {
    responseMode: 'template';
    agentData: {
        template: 'success' | 'empty' | 'error';
        count?: number;
        topic?: 'AI' | 'technology' | 'science' | 'health' | 'business' | 'other';
        articleIds?: string[];
    };
}
interface DetailsOutputPassthrough {
    responseMode: 'passthrough';
    agentData?: undefined;
    userContent: {
        contentType: 'article';
        content: string;
        metadata?: {
            title: string;
            articleId: string;
        };
    };
}
interface DetailsOutputTemplate {
    responseMode: 'template';
    agentData: {
        template: 'not_found' | 'error';
    };
    userContent?: undefined;
}
type DetailsOutput = DetailsOutputPassthrough | DetailsOutputTemplate;
interface ListOutputPassthrough {
    responseMode: 'passthrough';
    agentData?: undefined;
    userContent: {
        contentType: 'article-list';
        content: string;
        metadata?: {
            count: number;
        };
    };
}
interface ListOutputTemplate {
    responseMode: 'template';
    agentData: {
        template: 'no_articles' | 'error';
    };
    userContent?: undefined;
}
type ListOutput = ListOutputPassthrough | ListOutputTemplate;
type SkillOutput = SearchOutput | DetailsOutput | ListOutput;
declare function invoke(input: SkillInput): Promise<SkillOutput>;
declare const _default: {
    invoke: typeof invoke;
};
export default _default;
