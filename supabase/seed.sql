/*
 * Create some guests in the table 
 */
insert into
    public.guests (first_name, last_name, genre, status)
values
    ('Omaris', 'Segovia', 2, 1),
    ('Ali', 'Gonzáles', 1, 1),
    ('Sofia', 'Gonzáles', 2, 1), 
    ('Josmari', 'Baptista', 2, 1),
    ('José', 'Baptista', 1, 1),
    ('Jenia', 'Baptista', 2, 1),
    ('María', 'Baptista', 2, 1); 

/*
 * Create couple invitations in the table 
 */
insert into
    public.invitations (key, name, code, status)
values
    ('KdkmvRkyUo', 'Familia Segovia Gonzáles', '012345', 1),
    ('pkrS8Igyaq', 'Familia Baptista', '123456', 1);

/*
 * Relate invitations to its guests
 */
update public.guests set invitation_id = 1 where id in (1, 2, 3);
update public.guests set invitation_id = 2 where id in (4, 5, 6, 7);