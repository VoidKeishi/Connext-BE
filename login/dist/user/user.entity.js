"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    get passwordHashed() {
        return this._passwordHashed;
    }
    set passwordHashed(value) {
        this._passwordHashed = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get userName() {
        return this._userName;
    }
    set userName(value) {
        this._userName = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get nickName() {
        return this._nickName;
    }
    set nickname(value) {
        this._nickName = value;
    }
    get avatarUrl() {
        return this._avatarUrl;
    }
    set avatarUrl(value) {
        this._avatarUrl = value;
    }
    get dateOfBirth() {
        return this._dateOfBirth;
    }
    set dateOfBirth(value) {
        this._dateOfBirth = value;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    get lastLogin() {
        return this._lastLogin;
    }
    set lastLogin(value) {
        this._lastLogin = value;
    }
    get isOnline() {
        return this._isOnline;
    }
    set isOnline(value) {
        this._isOnline = value;
    }
    get lastActiveAt() {
        return this._lastActiveAt;
    }
    set lastActiveAt(value) {
        this._lastActiveAt = value;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "_userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "_passwordHashed", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "_nickName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "_avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "_dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "_createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'last_login', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "_lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, name: 'is_online' }),
    __metadata("design:type", Boolean)
], User.prototype, "_isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_active_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "_lastActiveAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('User')
], User);
//# sourceMappingURL=user.entity.js.map