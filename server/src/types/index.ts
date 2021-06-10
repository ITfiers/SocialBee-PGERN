export interface Post {
    id: string
    description: string
    image: string
    user_id: string
}

export interface User {
    id: string
    username: string
    email: string
    avatar: string
    password: string
}

export interface Comment {
    id: string
    description: string
    post_id: string
    user_id: string
}
