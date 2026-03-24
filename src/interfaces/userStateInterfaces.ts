import type {UserInterfaces} from "@/interfaces/userInterfaces.ts";

export interface UserStateInterfaces {
    currentUser: UserInterfaces | null
    token: string | null
}
