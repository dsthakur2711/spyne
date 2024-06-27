# Database Schema

## Users

| Field Name         | Data Type | Constraints |
| ------------------ | --------- | ----------- |
| id                 | int       | Primary Key |
| email              | string    |             |
| full_name          | string    |             |
| phone_number       | string    |             |
| encrypted_password | string    |             |
| access_token       | string    |             |
| refresh_token      | string    |             |
| created_at         | datetime  |             |
| updated_at         | datetime  |             |

## Posts

| Field Name | Data Type | Constraints |
| ---------- | --------- | ----------- |
| id         | int       | Primary Key |
| text       | string    |             |
| user_id    | int       | Foreign Key |
| view_count | int       |             |
| created_at | datetime  |             |
| updated_at | datetime  |             |

### Relationships

- `user_id` references `users.id`

## Comments

| Field Name | Data Type | Constraints |
| ---------- | --------- | ----------- |
| id         | int       | Primary Key |
| text       | string    |             |
| user_id    | int       | Foreign Key |
| post_id    | int       | Foreign Key |
| parent_id  | int       |             |
| created_at | datetime  |             |
| updated_at | datetime  |             |

### Relationships

- `user_id` references `users.id`
- `post_id` references `posts.id`
- `parent_id` references `comments.id`

## Reactions

| Field Name    | Data Type | Constraints       |
| ------------- | --------- | ----------------- |
| id            | int       | Primary Key       |
| user_id       | int       | Foreign Key       |
| entity_type   | string    |                   |
| entity_id     | int       |                   |
| reaction_type | enum      | { like, dislike } |
| created_at    | datetime  |                   |
| updated_at    | datetime  |                   |

### Relationships

- `user_id` references `users.id`

## Hashtags

| Field Name | Data Type | Constraints |
| ---------- | --------- | ----------- |
| id         | int       | Primary Key |
| name       | string    |             |
| created_at | datetime  |             |
| updated_at | datetime  |             |

## Hashtag Mappings

| Field Name | Data Type | Constraints |
| ---------- | --------- | ----------- |
| id         | int       | Primary Key |
| post_id    | int       | Foreign Key |
| hashtag_id | int       | Foreign Key |
| created_at | datetime  |             |
| updated_at | datetime  |             |

### Relationships

- `post_id` references `posts.id`
- `hashtag_id` references `hashtags.id`

## Follower Mappings

| Field Name   | Data Type | Constraints |
| ------------ | --------- | ----------- |
| id           | int       | Primary Key |
| follower_id  | int       | Foreign Key |
| following_id | int       | Foreign Key |
| created_at   | datetime  |             |
| updated_at   | datetime  |             |

### Relationships

- `follower_id` references `users.id`
- `following_id` references `users.id`
