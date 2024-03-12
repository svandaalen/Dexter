create table citations
(
    id uuid primary key default gen_random_uuid(),
    input text not null unique,
    terms text not null unique,
    created_by uuid not null references users (id)
);
create index on citations(terms);

create table sources_citations
(
    citation_id uuid references metadata_values (id) on delete cascade,
    source_id uuid references sources (id)
);
create index on sources_citations(citation_id, source_id);

create table corpora_citations
(
    citation_id uuid references metadata_values (id) on delete cascade,
    corpus_id uuid references corpora (id)
);
create index on corpora_citations(citation_id, corpus_id);
