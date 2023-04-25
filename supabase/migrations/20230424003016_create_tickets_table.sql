create table
  public.tickets (
    id bigint generated by default as identity not null,
    status bigint null,
    invitation_id bigint not null,
    created_at timestamp with time zone null default now(),
    constraint tickets_pkey primary key (id),
    constraint tickets_invitation_id_fkey foreign key (invitation_id) references invitations (id)
  ) tablespace pg_default;