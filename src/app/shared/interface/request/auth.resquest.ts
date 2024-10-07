//google login

export interface IGoogleLoginRequest {
    sub: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null,
    fcmToken: string | null
}