# Connext - Web Development Capstone Project
- Capstone project for web development course at Hanoi University of Science and Technology
- Building a web application for messaging and online calling
- Using NextJS for frontend and NestJS for backend
## Group members
- Pham Phan Anh - 20210039
- Nguyen The Anh - 20205199
- Pham Hai Nam Anh - 20214986
## Features
- User authentication
- User management
- Friend management
- Group chat
- Messaging
- Online calling
## Tech stack
- NextJS
- NestJS
- PostgreSQL
- TypeORM
- Socket.IO
- JWT
- Docker
## Backend structure
src/
├── app.module.ts
├── main.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts 
│   ├── jwt.strategy.ts
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── dtos/
│       ├── login.dto.ts
│       └── signup.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   └── dtos/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── friends/
│   ├── friends.module.ts
│   ├── friends.controller.ts
│   ├── friends.service.ts
│   ├── friendship.entity.ts
│   ├── repositories/
│   │   └── friendship.repository.ts
│   └── dtos/
│       ├── create-friend-request.dto.ts
│       └── update-friend-status.dto.ts
├── group-chat/
│   ├── group-chat.module.ts
│   ├── group-chat.controller.ts
│   ├── group-chat.service.ts
│   ├── entities/
│   │   ├── group.entity.ts
│   │   └── group-member.entity.ts
│   ├── repositories/
│   │   └── group.repository.ts
│   └── dtos/
│       ├── create-group.dto.ts
│       └── add-group-member.dto.ts
├── messages/
│   ├── messages.module.ts
│   ├── messages.controller.ts
│   ├── messages.service.ts
│   ├── message.entity.ts
│   ├── repositories/
│   │   └── message.repository.ts
│   └── dtos/
│       ├── send-message.dto.ts
│       └── receive-message.dto.ts
├── calls/
│   ├── calls.module.ts
│   ├── calls.controller.ts
│   ├── calls.service.ts
│   ├── call.entity.ts
│   ├── repositories/
│   │   └── call.repository.ts
│   └── dtos/
│       ├── initiate-call.dto.ts
│       └── end-call.dto.ts
├── websocket/
│   ├── websocket.module.ts
│   ├── websocket.gateway.ts
│   ├── events/
│   │   ├── message.events.ts
│   │   └── call.events.ts
│   └── dtos/
│       └── socket-event.dto.ts
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   ├── transform.interceptor.ts
│   │   └── logging.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── middleware/
│       └── logger.middleware.ts
├── config/
│   ├── config.module.ts
│   ├── config.service.ts
│   └── configuration.ts
├── database/
│   ├── database.module.ts
│   ├── database.providers.ts
│   └── migrations/
├── constants/
│   ├── messages.constant.ts
│   ├── events.constant.ts
│   └── errors.constant.ts
├── interfaces/
│   ├── user.interface.ts
│   ├── message.interface.ts
│   └── call.interface.ts
└── utils/
    ├── file-upload.util.ts
    └── validation.util.ts