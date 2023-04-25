/*
 * Create some guests in the table 
 */
insert into
    public.guests (id, first_name, last_name, genre, status)
values
    (1, 'Omaris', 'Segovia', 2, 1),
    (2, 'Ali', 'Gonzáles', 1, 1),
    (3, 'Sofia', 'Gonzáles', 2, 1), 
    (4, 'Josmari', 'Baptista', 2, 1),
    (5, 'José', 'Baptista', 1, 1),
    (6, 'Jenia', 'Baptista', 2, 1),
    (7, 'María', 'Baptista', 2, 1); 

/*
 * Create couple invitations in the table 
 */
insert into
    public.invitations (id, key, name, code, status)
values
    (1, 'KdkmvRkyUo', 'Familia Segovia Gonzáles', '012345', 1),
    (2, 'pkrS8Igyaq', 'Familia Baptista', '123456', 1);

/*
 * Relate invitations to its guests
 */
update public.guests set invitation_id = 1 where id in (1, 2, 3);
update public.guests set invitation_id = 2 where id in (4, 5, 6, 7);