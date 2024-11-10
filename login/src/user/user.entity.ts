import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn() private _id: number;

    @Column({ length: 50, unique: true }) private _userName: string;

    @Column({ nullable: false }) private _passwordHashed: string;

    @Column({ length: 100, unique: true }) private _email: string;

    @Column({ length: 50, nullable: true }) private _nickName?: string;

    @Column({ nullable: true }) private _avatarUrl?: string;

    @Column({ type: 'date', nullable: true }) private _dateOfBirth?: Date;

    @CreateDateColumn({ name: 'created_at' }) private _createdAt: Date;

    @UpdateDateColumn({ name: 'last_login', nullable: true }) private _lastLogin?: Date;

    @Column({ default: false, name: 'is_online' }) private _isOnline: boolean;

    @Column({ name: 'last_active_at', nullable: true }) private _lastActiveAt?: Date;

    get passwordHashed(): string {
        return this._passwordHashed;
    }

    set passwordHashed(value: string) {
        this._passwordHashed = value;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get nickName(): string {
        return this._nickName;
    }

    set nickname(value: string) {
        this._nickName = value;
    }

    get avatarUrl(): string {
        return this._avatarUrl;
    }

    set avatarUrl(value: string) {
        this._avatarUrl = value;
    }

    get dateOfBirth(): Date {
        return this._dateOfBirth;
    }

    set dateOfBirth(value: Date) {
        this._dateOfBirth = value;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    get lastLogin(): Date {
        return this._lastLogin;
    }

    set lastLogin(value: Date) {
        this._lastLogin = value;
    }

    get isOnline(): boolean {
        return this._isOnline;
    }

    set isOnline(value: boolean) {
        this._isOnline = value;
    }

    get lastActiveAt(): Date {
        return this._lastActiveAt;
    }

    set lastActiveAt(value: Date) {
        this._lastActiveAt = value;
    }
}
