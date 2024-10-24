script database: postgresql://localhost:5432/messageweb
create table login
(
id         integer generated always as identity
primary key,
password   varchar(255) not null,
email      varchar(255) not null
unique,
created_at timestamp default CURRENT_TIMESTAMP,
user_name  varchar(255)
);

alter table login
owner to postgres;



