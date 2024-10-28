import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('login')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
