create table
  public.invitations (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    name text null,
    key text not null,
    code text not null,
    status bigint not null default '1'::bigint,
    rejections bigint array null,
    constraint invitations_pkey primary key (id),
    constraint invitations_key_key unique (key),
    constraint invitations_code_key unique (code)
  ) tablespace pg_default;