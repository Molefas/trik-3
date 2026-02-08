# Article Search Trik

A demo trik that searches for and retrieves articles. Demonstrates type-directed privilege separation with session support.

## Installation

```bash
trik install @muffles/article-search
```

## Actions

### `search`

Search for articles by topic.

**Response Mode:** Template (structured data only)

```typescript
// Input
{ topic: "AI" }

// Agent receives structured data, not raw content
{ template: "success", count: 5, topic: "AI", articleIds: ["art-1", "art-2", ...] }
```

### `details`

Get the full content of an article.

**Response Mode:** Passthrough (content delivered directly to user)

```typescript
// Input
{ articleId: "art-1" }
// or
{ reference: "the healthcare one" }

// Content bypasses agent, goes straight to user
```

### `list`

List article titles and summaries from current session.

**Response Mode:** Passthrough

## Security

This trik demonstrates **privilege separation**:

- **Template mode actions** (`search`): Agent only sees structured data with constrained string types (enums). No free-form text that could contain prompt injection.
- **Passthrough mode actions** (`details`, `list`): Article content goes directly to the user, never passing through the agent.

## Session Support

The trik maintains session state:
- Search results are stored in session
- `list` and `details` can reference previous search results
- Session expires after 30 minutes

## Development

```bash
# Build
npm run build

# The compiled output goes to dist/graph.js
```

## License

MIT
