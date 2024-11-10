CREATE TABLE "User" (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
nickname VARCHAR(50),
avatar_url VARCHAR(255),
date_of_birth DATE,
created_at TIMESTAMP DEFAULT NOW(),
last_login TIMESTAMP,
is_online BOOLEAN DEFAULT FALSE,
last_active_at TIMESTAMP
);

CREATE TABLE "Friendship" (
friendship_id SERIAL PRIMARY KEY,
user_id INT REFERENCES "User"(user_id) ON DELETE CASCADE,
friend_user_id INT REFERENCES "User"(user_id) ON DELETE CASCADE,
status VARCHAR(20) NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
CONSTRAINT unique_friendship UNIQUE (user_id, friend_user_id),
CONSTRAINT no_self_friendship CHECK (user_id <> friend_user_id)
);

CREATE TABLE "GroupChat" (
group_id SERIAL PRIMARY KEY,
group_name VARCHAR(100) NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
created_by INT REFERENCES "User"(user_id) ON DELETE SET NULL
);

CREATE TABLE "GroupMember" (
group_member_id SERIAL PRIMARY KEY,
group_id INT REFERENCES "GroupChat"(group_id) ON DELETE CASCADE,
user_id INT REFERENCES "User"(user_id) ON DELETE CASCADE,
role VARCHAR(20) DEFAULT 'member',
joined_at TIMESTAMP DEFAULT NOW(),
CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
);

CREATE TABLE "Message" (
message_id SERIAL PRIMARY KEY,
sender_id INT REFERENCES "User"(user_id) ON DELETE SET NULL,
group_id INT REFERENCES "GroupChat"(group_id) ON DELETE CASCADE,
recipient_id INT REFERENCES "User"(user_id) ON DELETE SET NULL,
content TEXT NOT NULL,
media_url VARCHAR(255),
media_type VARCHAR(20),
timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Call" (
call_id SERIAL PRIMARY KEY,
initiator_id INT REFERENCES "User"(user_id) ON DELETE SET NULL,
group_id INT REFERENCES "GroupChat"(group_id) ON DELETE CASCADE,
recipient_id INT REFERENCES "User"(user_id) ON DELETE SET NULL,
call_type VARCHAR(20) NOT NULL,
start_time TIMESTAMP NOT NULL,
end_time TIMESTAMP,
status VARCHAR(20) NOT NULL
);


